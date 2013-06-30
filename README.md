service-connector
==========

Service connector [pattern](http://www.servicedesignpatterns.com/WebServiceInfrastructures/ServiceConnector) implementation for connecting jQuery invocation to and Spring framework services.

My first repository is dedicated to Felipe (@fmanaya), one of my best teachers.

## Dependencies

* jQuery framework (min v.1.9.1) ([http://jquery.org](http://jquery.org))
* Twitter Bootstrap ([http://twitter.github.io/bootstrap](http://twitter.github.io/bootstrap))

## Dependencies (optional)
* jQuery Templates plugin ([https://github.com/jquery/jquery-tmpl](https://github.com/jquery/jquery-tmpl)) when using `template` parameter in loader function


## Error management

The followings errors must be controller from javascript area:

* **0**: Server not found
* **400**: Bad parameter invoking the service
* **404**: Bad URL invoking the service
* **500**: Internal error
* **503**: The server is not avalible (Service Temporarily Unavailable)


