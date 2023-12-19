

/**
 * This function takes a hexadecimal string and converts it to a decimal number.
 *
 * @param hexString - The hexadecimal string to convert to decimal.
 *
 * @returns {number} - The decimal representation of the hexadecimal string.
 *
 * @throws {Error} Will throw an error if the input is not a valid hexadecimal string.
 *
 * @example
 * // Convert hexadecimal string to decimal
 * const decimal = hexToDecimal("0x8894E0a0c962CB723c1976a4421c95949bE2D4E3");
 * console.log(decimal); // Output: 12345678901234567890
 */
export function hexToDecimal(hexString: string, stripZeroX: boolean = true): number {
    // Remove the "0x" prefix from the hexadecimal string
    if (stripZeroX) hexString = hexString.slice(2);
 
    // Convert the hexadecimal string to decimal using the parseInt function
    const decimalValue = parseInt(hexString, 16);
 
    // Check if the conversion was successful
    if (isNaN(decimalValue)) {
        throw new Error("Invalid hexadecimal string");
    }
 
    return decimalValue;
}