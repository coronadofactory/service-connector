package com.coronadoland.spring;

import java.util.Locale;

import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;

/** 
 * Interface to response
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

public interface Responser {

	public ResponseEntity<String> getResponse(Object bean, Logger logger);
	public ResponseEntity<String> getResponseError(Exception e, Locale locale, Logger logger);

}
