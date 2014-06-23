// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Map
if(!Array.prototype.map){Array.prototype.map=function(callback,thisArg){var T,A,k;if(this==null){throw new TypeError(" this is null or not defined")}var O=Object(this);var len=O.length>>>0;if(typeof callback!=="function"){throw new TypeError(callback+" is not a function")}if(thisArg){T=thisArg}A=new Array(len);k=0;while(k<len){var kValue,mappedValue;if(k in O){var Pk=k.toString();kValue=O[Pk];mappedValue=callback.call(T,kValue,k,O);A[Pk]=mappedValue}k++}return A}}

