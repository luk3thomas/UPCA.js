//  Author: Luke Thomas
// Version: 0.0.1

var UPCA = function(container) {
    this.container = container;
};

UPCA.prototype = (function(){

    var methods, markup, generate, bars, checksum;

    bars = [

        // Bar code map for each number

        [1, 1, 1, 0, 0, 1, 0] , // 0
        [1, 1, 0, 0, 1, 1, 0] , // 1
        [1, 1, 0, 1, 1, 0, 0] , // 2
        [1, 0, 0, 0, 0, 1, 0] , // 3
        [1, 0, 1, 1, 1, 0, 0] , // 4
        [1, 0, 0, 1, 1, 1, 0] , // 5
        [1, 0, 1, 0, 0, 0, 0] , // 6
        [1, 0, 0, 0, 1, 0, 0] , // 7
        [1, 0, 0, 1, 0, 0, 0] , // 8
        [1, 1, 1, 0, 1, 0, 0] , // 9

        // Bar code map for middle and quiet zones

        [1, 0, 1, 0, 1] ,       // middle zone
        [0, 1, 0]               // quiet zone
    ];

    // Logic for creating the barcode markup

    markup = {

        // Generates markup for a single number
        bar: function(n) {
            return bars[n].map(function(d){
                return ['<b class="bar ', (d ? 'o' : 'e'), '"></b>'].join('');
            }).join('');
        },

        // Generates markup for a group of bars
        column: function(n, i) {
            return [
                '<div class="column column-', i, '">',
                    markup.bar(n),
                '</div>'
            ].join('');
        },

        columns: function(numbers, index) {
            return numbers.map(function(d, i){
                return markup.column(d, i + index);
            });
        },

        // Generates the quiet area on each side of the barcode
        quietZone: function() {
            return [
                '<div class="bars quiet-area">',
                    markup.bar(11),
                '</div>'
            ].join('');
        },

        // Generates the middle area between the left and right digits
        middleZone: function() {
            return [
                '<div class="bars middle-area">',
                    markup.bar(10),
                '</div>'
            ].join('');
        },

        // Generate the markup for the entire barcode

        barcode: function(left, right) {
            return [
                '<div class="upc-wrap">',
                    markup.quietZone(),

                    '<div class="bars left">',
                        markup.columns(left, 1).join(''),
                    '</div>',

                    markup.middleZone(),

                    '<div class="bars right">',
                        markup.columns(right, 7).join(''),
                    '</div>',

                    markup.quietZone(),
                '</div>'
            ].join('');
        }
    };

    checksum = {

        // checksum for a string of numbers
        single: function(numbers, compare) {
            return numbers
                .map(function(d, i){
                    return i % 2 === compare ? d : 0;
                })
                .reduce(function(sum, n){ return sum + n; });
        },

        // checksum for the entire number
        all: function(numbers) {
            return checksum.single(numbers, 0) * 3 + checksum.single(numbers, 1);
        },

        // Generates checksum bars for last column
        last: function(numbers) {
            var n = checksum.all(numbers).toString().slice(-1);
            return n === 0 ? 0 : 10 - n;
        }
    };

    // Generates the left and right numbers
    generate = function(number) {

        var numbers, left, right;

        // split the number into an array

        numbers = number.toString().split('').map(function(d){ return parseInt(d); });

        if (numbers.length !== 11)
            throw new TypeError("Number must be 11 digits.");

        // generate barcode for left and right digits
        // omit the last digit for the right, we'll run a
        // checksum with the last digit

        left  = numbers.slice(0,  6);
        right = numbers.slice(6, 11);

        // add the final right bar using the checksum
        // calculation

        right.push(checksum.last(numbers));

        return [left, right];
    };

    // Generates html markup for the left and right numbers
    html = function(number) {
        var sides = generate(number);
        return markup.barcode(sides[0], sides[1]);
    };

    // Exposed API for UPCA

    methods = {
        render: function(numbers) {
            this.container.innerHTML = html(numbers);
        }
    };

    return methods;
})();

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Map
if(!Array.prototype.map){Array.prototype.map=function(callback,thisArg){var T,A,k;if(this==null){throw new TypeError(" this is null or not defined")}var O=Object(this);var len=O.length>>>0;if(typeof callback!=="function"){throw new TypeError(callback+" is not a function")}if(thisArg){T=thisArg}A=new Array(len);k=0;while(k<len){var kValue,mappedValue;if(k in O){var Pk=k.toString();kValue=O[Pk];mappedValue=callback.call(T,kValue,k,O);A[Pk]=mappedValue}k++}return A}}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
if("function"!==typeof Array.prototype.reduce){Array.prototype.reduce=function(callback){"use strict";if(null===this||"undefined"===typeof this){throw new TypeError("Array.prototype.reduce called on null or undefined")}if("function"!==typeof callback){throw new TypeError(callback+" is not a function")}var t=Object(this),len=t.length>>>0,k=0,value;if(arguments.length>=2){value=arguments[1]}else{while(k<len&&!k in t)k++;if(k>=len)throw new TypeError("Reduce of empty array with no initial value");value=t[k++]}for(;k<len;k++){if(k in t){value=callback(value,t[k],k,t)}}return value}}

