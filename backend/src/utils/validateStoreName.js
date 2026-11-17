const STORE_NAME_PATTERN = /^[a-z0-9-]+$/;
const RESERVED_NAMES = [ "www", "admin", "api", "support", "mail", "app" ];

const validateStoreName = (name) => {
    if (RESERVED_NAMES.includes(name)) {
        return "You can't use reserved names"
    }
    if (name.length < 3 || name.length > 30) {
        return "Store name must be between 3 and 30 characters";
    } 
    if (name.startsWith("-") || name.endsWith("-")) {
        return "Store name should not start or end with hyphen"
    }
    if (!STORE_NAME_PATTERN.test(name)) {
        return "Store name can only contain lowercase letters, numbers and hyphens";
    }
    return null;
}

export {validateStoreName};