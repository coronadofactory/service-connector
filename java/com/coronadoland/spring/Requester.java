package com.coronadoland.spring;

import org.slf4j.Logger;

/** 
 * Interface to request
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

public interface Requester {

	public <T> T getRequest(Class<T> request, String json, Logger logger);

}
