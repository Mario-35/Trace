export function removeComments(input: string){
    //Takes a string of code, not an actual function.
    return input.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g,'').trim();
}