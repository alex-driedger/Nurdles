define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/IDreportTemplate.html',
    'jquerycookie'
], function ($, _, Backbone, IDreportTemplate, jQueryCookie) {
    
    var IDReportView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        
        // redirect is used on successful create or update.
        initialize: function (options) {
            this.collection = options.collection
            this.render();
        },
        
        render: function () {
            var temp = this.collection.models[0].attributes
            var items = []
            for (i in temp)
            {
                if (i != "items")
                {
                    items.push({name: i, value: temp[i]})
                } else
                {   
                    for (j in temp[i])
                    {
                        items.push({name: temp[i][j].name,value: temp[i][j].value})
                    }
                }
            }
            this.$el.html(_.template(IDreportTemplate, {items: items}));
            return this;
        },
        
    });
    
    return IDReportView;
    
});
