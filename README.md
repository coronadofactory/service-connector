service-connector
==========

[Service connector pattern](http://www.servicedesignpatterns.com/WebServiceInfrastructures/ServiceConnector) implementation for connecting jQuery invocation to and Spring framework services.

My first repository is dedicated to Felipe ([https://github.com/fmanaya](https://github.com/fmanaya) | [https://twitter.com/fmanaya](https://twitter.com/fmanaya)), one of my best teachers.

## Dependencies

* jQuery framework (min v.1.9.1) ([http://jquery.org](http://jquery.org))

## Dependencies (optional)
* Undescore.js ([http://underscorejs.org](http://underscorejs.org)) when using `template` parameter in loader function
* Twitter Bootstrap ([http://twitter.github.io/bootstrap](http://twitter.github.io/bootstrap)) when using `bootstrap-connector.js`


## Error management

The followings errors must be controller from javascript area:

* **0**: Server not found
* **400**: Bad parameter invoking the service
* **404**: Bad URL invoking the service
* **500**: Internal error
* **503**: The server is not avalible (Service Temporarily Unavailable)


