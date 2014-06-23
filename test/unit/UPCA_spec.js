describe('UPCA', function(){

    var div = document.createElement('div');
    div.id = 'barcode';
    document.body.appendChild(div);

    var barcode,
        numbers = [1,2,3,4,5,6,7,8,9,0,1];

    beforeEach(function(){
        barcode = new UPCA(document.getElementById('barcode'));
    });

    it("throws an error if number is not 11 digits", function(){
        expect(function(){barcode.generate('1')}).toThrow(new TypeError('Number must be 11 digits.'));
    });

    it("generates correct sides for a number", function(){
        expect(barcode.generate(numbers.join(''))).toEqual([[1,2,3,4,5,6], [7,8,9,0,1,2]])
    });

    describe("checksum", function(){

        it("calculates left checksum", function(){
            expect(barcode.checksum.single(numbers, 0)).toBe(26)
        });

        it("calculates right checksum", function(){
            expect(barcode.checksum.single(numbers, 1)).toBe(20)
        });

        it("calculates total checksum", function(){
            expect(barcode.checksum.all(numbers)).toBe(26 * 3 + 20)
        });

        it("calculates total checksum", function(){
            expect(barcode.checksum.last(numbers)).toBe(2)
        });
    });

    describe("html", function(){

        it("generates correct markup for bar1", function(){
            expect(barcode.html(numbers.join(''))).toMatch(/bar o/);
        });
    });
});
