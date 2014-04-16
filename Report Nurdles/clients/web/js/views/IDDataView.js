define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/IDdataTemplate.html',
    'jquerycookie'
], function ($, _, Backbone, IDdataTemplate, jQueryCookie) {
    
    var IDDataView = Backbone.View.extend({

        tagName   : 'div',
        className : '',
        events: {
        },
        download: function() {
            var temp = this.collection.models[0].attributes
            var items = ""
            for (i in temp)
            {
                if (i != "items")
                {
                    items += (i+","+temp[i])
                } else
                {
                    for (j in temp[i])
                    {
                        items += (temp[i][j].name + "," + temp[i][j].value + "\n")
                    }
                }
                items += "\n"
            }
            items = items.replace(/&gt;/g, ">")
            items = items.replace(/&lt;/g, "<")
            console.log(items)
            console.log(this.collection.models[0].attributes._id)
                var a = document.getElementById("download")
                a.href = 'data:attachment/csv,' + encodeURIComponent(items);
                a.download = this.collection.models[0].attributes._id + '.csv';
        },
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
            this.$el.html(_.template(IDdataTemplate, {items: items}));
            return this;

        },
        
    });
    
    return IDDataView;
    
});
