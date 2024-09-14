export function buildPath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\\-_]+)') // Corrigido o padrão para capturar o parâmetro
    const pathRegex = new RegExp(`^${pathWithParams}(?:\\?(?<query>[^#]*))?$`) // Adicionado o símbolo $ para indicar o final da string
    return pathRegex
}