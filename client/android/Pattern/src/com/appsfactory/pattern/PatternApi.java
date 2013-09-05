package com.appsfactory.pattern;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConfig;
import org.scribe.model.Token;

public class PatternApi extends DefaultApi20 {

	private static final String ACCESS_TOKEN_RESOURCE  = "localhost:4010/oauth/authorize";
	private static final String AUTHORIZE_URL          = "localhost:4010/oauth/authorize";
	private static final String REQUEST_TOKEN_RESOURCE = "localhost:4010/oauth/authorize";
	
	@Override
	public String getAccessTokenEndpoint() {
		return "http://" + ACCESS_TOKEN_RESOURCE;
	}
	
	@Override
	public String getAuthorizationUrl(OAuthConfig config) {
		return "http://" + AUTHORIZE_URL;
	}

}
