function imageDataToRgba(color) {
    return `rgba(${color.data[0]}, ${color.data[1]}, ${color.data[2]}, ${color.data[3]})`;
}

describe('imageData To Rgba', () => {
    test('make rgba from imageData', () => {
        
        const color1 = {};
        const color2 = {};
        const color3 = {};

        color1.data = [255, 255, 255, 150];
        color2.data = [150, 150, 150, 150];
        color3.data = [50, 50, 50, 150];

        const result1 = 'rgba(255, 255, 255, 150)';
        const result2 = 'rgba(150, 150, 150, 150)';
        const result3 = 'rgba(50, 50, 50, 150)';


        expect(imageDataToRgba(color1)).toEqual(result1);
        expect(imageDataToRgba(color2)).toEqual(result2);
        expect(imageDataToRgba(color3)).toEqual(result3);
    });
});
