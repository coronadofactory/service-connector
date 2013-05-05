package com.coronadoland.spring;

import org.slf4j.Logger;

import flexjson.JSONDeserializer;

/** 
 * Accept JSON request from spring-js.service.js
 *
 * http://github.com/coronadoland
 * 
 * Copyright (c) 2011-2013 Jose Antonio Garcia
 * Released under the MIT license
 * https://raw.github.com/coronadoland/service-connector/master/LICENSE.txt
 *
 * Date: 2013-04-10
 * @author Jose Antonio Garcia
 */

public class JSONRequester implements Requester {

	public <T> T getRequest(Class<T> request, String json, Logger logger) {
		
		if (logger.isDebugEnabled()) logger.debug(json);
		
		return new JSONDeserializer<T>()
			.use(null, request)
			.deserialize(json, request);
		
	}

}
