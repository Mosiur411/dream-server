const errorMessageFormatter = (err) => {
    return { code: err.code, error: err.message }
}
module.exports = {
    errorMessageFormatter
}