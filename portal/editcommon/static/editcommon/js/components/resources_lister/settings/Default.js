define([], function() {

    return {
        resultFields: ["identifier", "category", "version", "attributes"],
        requestURL: "//search.{{ TOP_DOMAIN }}/search/edit/query/",
        requestSize: 10,

        featured: { field: 'source' }
    }

});
