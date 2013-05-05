package com.coronadoland.spring;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Locale;

import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import flexjson.JSONException;
import flexjson.JSONSerializer;

/** 
 * Send JSON to service-connector.js
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


public class JSONResponser implements Responser {

	private ErrorRegister errorRegister;
	public void setErrorRegister(ErrorRegister errorRegister) {
		this.errorRegister=errorRegister;
	}
	
	public ResponseEntity<String> getResponse(Object bean, Logger logger) {
		
		try {
			return getResponseBean(bean, logger);
		} catch (JSONException e) {
			StringWriter writer = new StringWriter();
			PrintWriter pw = new PrintWriter(writer);
			e.printStackTrace(pw);
			String msg = "Se ha producido un error. Consulte con su administrador";
			errorRegister.register(msg);
			return getResponseError(msg, logger);
		} catch (Exception e) {
			errorRegister.register(e);
			return getResponseError(e.getMessage(), logger);
		}

	}
	

	private ResponseEntity<String> getResponseBean(Object bean, Logger logger) throws Exception {
		return getResponseBean(bean, HttpStatus.OK, logger);
	}

	private ResponseEntity<String> getResponseError(String bean, Logger logger) {
		return getResponse(bean, HttpStatus.INTERNAL_SERVER_ERROR, logger);
	}

	public ResponseEntity<String> getResponseError(Exception e, Locale locale, Logger logger) {
		e.printStackTrace();
		return getResponseError(e.toString(), logger);
	}

	private ResponseEntity<String> getResponseBean(Object bean, HttpStatus status, Logger logger) throws Exception {
		return getResponse(Stringfy(bean), status, logger);
	}

	public String Stringfy(Object bean) throws Exception {
//		return new String(new String(new JSONSerializer().exclude("*.class").deepSerialize(bean).getBytes("UTF-8")).getBytes(),"ISO-8859-1");
		return new String(new String(new JSONSerializer().exclude("*.class").deepSerialize(bean).getBytes("UTF-8")));
	}

	private ResponseEntity<String> getResponse(String out, HttpStatus status, Logger logger) {
//		HttpHeaders headers = new HttpHeaders();
//		headers.add("Content-Type", "text/xml;charset=ISO-8859-1");		
		if (logger.isDebugEnabled()) logger.debug(out);
		return new ResponseEntity<String>(out, /*headers,*/ status);
	}

}
