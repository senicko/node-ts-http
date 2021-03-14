// Check if request url fit into schema
export const compareUrl = (schema: string, url: string): boolean => {
    // Remove query and split
    const dividedSchema = schema.split('/');
    const dividedUrl = url.split('?')[0].split('/');

    // If length of urls is different return false
    if (dividedSchema.length !== dividedUrl.length) return false;

    // Check each url node
    for (let i = 0; i < dividedSchema.length; i++) {
        // If schema node does not start with semicolon, and nodes aren't equal return false
        if (
            dividedSchema[i].startsWith(':') === false &&
            dividedSchema[i] !== dividedUrl[i]
        )
            return false;
    }

    // Url matches schema
    return true;
};

// Get params from a url
export const getUrlParams = (
    schema: string,
    url: string
): { [key: string]: string } => {
    // Declare final object
    const params: { [key: string]: string } = {};

    const dividedUrl = url.split('/');
    schema.split('/').forEach((node, i) => {
        // Iterate through url and find params
        if (node.startsWith(':')) params[node.split(':')[1]] = dividedUrl[i];
    });

    return params;
};
