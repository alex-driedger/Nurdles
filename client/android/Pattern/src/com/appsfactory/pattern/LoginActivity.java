package com.appsfactory.pattern;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class LoginActivity extends Activity implements OnClickListener, HttpRequestTaskListener {
	private static final String TAG = "LoginActivity";
	
	private static final String BASE_URL = "http://10.172.69.51:4010/";
	private static final String ACCESS_TOKEN_URL = "oauth/authorize/token";
	private static final String TEST_URL = "oauth/user";
	
	// Declare the instance variables.
	private EditText usernameEditText;
	private EditText passwordEditText;
	private Button authenticateButton;
	private TextView statusTextView;
	private String accessToken;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_login);
		
		// Reference the views
		usernameEditText = (EditText) findViewById(R.id.editTextUsername);
		passwordEditText = (EditText) findViewById(R.id.editTextPassword);
		authenticateButton = (Button) findViewById(R.id.buttonAuthenticate);
		statusTextView = (TextView) findViewById(R.id.textStatus);
		
		// Hook up the authenticate button
		authenticateButton.setOnClickListener(this);
	}

	@Override
	public void onClick(View v) {
		sendAuthenticationRequest();
	}
	
	protected void sendAuthenticationRequest() {
		String username = usernameEditText.getText().toString();
		String password = passwordEditText.getText().toString();
		
		String uri = BASE_URL + ACCESS_TOKEN_URL;
		String method = "post";

		ArrayList<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("grant_type", "password"));
		params.add(new BasicNameValuePair("client_id", "pattern"));
		params.add(new BasicNameValuePair("client_secret", "secret"));
		params.add(new BasicNameValuePair("username", username));
		params.add(new BasicNameValuePair("password", password));
		
		new HttpRequestTask(uri, method, params, this).execute();
	}
	
	protected void sendAuthenticationTest() {
		String uri = BASE_URL + "oauth/user?access_token=" + this.accessToken;
		String method = "get";
		
		ArrayList<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("access_token", this.accessToken));

		new HttpRequestTask(uri, method, params, this).execute();
	}
	
	@Override
	public void onReceivedResponse(String uri, String response) {
		
		// Parse the response as JSON when possible.
		JSONObject object = null;
		try {
			object = new JSONObject(response);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
		}
		
		// Obtaining an access token.
		if (uri == BASE_URL + ACCESS_TOKEN_URL) {
			
			// Check for an access token.
			try {
				String access_token = object.getString("access_token");
				this.accessToken = access_token;
				statusTextView.setText(access_token);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
			}
			
			// Check for an error description.
			try {
				String error_description = object.getString("error_description");
				statusTextView.setText(error_description);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
			}
			
			// Send an authentication test.
			if (this.accessToken != null) {
				sendAuthenticationTest();
			}
		
		} else {
			statusTextView.setText(response);
		}
		
	}

}
