define([
  'jquery'
], function ($) {

  // Serializes hash with name/value pairs into an object.
  $.fn.serializeObject = function () {
    var object = {};
    var form = this.serializeArray();
    $.each(form, function () {
      if (object[this.name] !== undefined) {
        if (!object[this.name].push) {
          object[this.name] = [object[this.name]];
        }
        object[this.name].push(this.value || '');
      } else {
        object[this.name] = this.value || '';
      }
    });
    return object;
  };

});