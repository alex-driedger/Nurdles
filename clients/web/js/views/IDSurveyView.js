define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/IDsurveyTemplate.html',
    'jquerycookie'
], function ($, _, Backbone, IDsurveyTemplate, jQueryCookie) {
    
    var IDSurveyView = Backbone.View.extend({

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
            console.log(temp)
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
            this.$el.html(_.template(IDsurveyTemplate, {items: items}));
            return this;

        },
        
    });
    
    return IDSurveyView;
    
});
