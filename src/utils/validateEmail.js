function validateEmail(email) {
    if (!email) {
        return false;
    }
    const domains = ['@estudiantes.uci.cu', '@profesores.uci.cu'];
    return domains.some((domain) => email.endsWith(domain));
}

module.exports = validateEmail;