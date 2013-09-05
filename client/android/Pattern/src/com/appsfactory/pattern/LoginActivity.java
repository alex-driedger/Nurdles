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

public class LoginActivity extends Activity implements OnClickListener {
	private static final String TAG = "LoginActivity";
	
	// Declare the views
	private EditText usernameEditText;
	private EditText passwordEditText;
	private Button authenticateButton;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_login);
		
		// Reference the views
		usernameEditText = (EditText) findViewById(R.id.editTextUsername);
		passwordEditText = (EditText) findViewById(R.id.editTextPassword);
		authenticateButton = (Button) findViewById(R.id.buttonAuthenticate);
		
		// Hook up the authenticate button
		authenticateButton.setOnClickListener(this);
	}

	@Override
	public void onClick(View v) {
		String username = usernameEditText.getText().toString();
		String password = passwordEditText.getText().toString();
		new AuthenticateTask().execute(username, password);
	}
	
	class AuthenticateTask extends AsyncTask <String, Integer, String> {
		private static final String BASE_URL = "http://10.172.69.52:4010"; 
		
		@Override
		protected String doInBackground(String... values) {
			
			String username = values[0];
			String password = values[1];
			
			try {
				authenticate(username, password);
				return "";
			} catch (Exception e) {
				return "";
			}
		}
		
		protected void authenticate(String username, String password) {
			
			// Create the client.
			HttpClient client = new DefaultHttpClient();
			
			// Create the request.
			HttpPost post = new HttpPost(BASE_URL + "/oauth/authorize/token");
			
			// Create the parameters list.
			List <NameValuePair> params = new ArrayList <NameValuePair> ();
			params.add(new BasicNameValuePair("grant_type", "password"));
			params.add(new BasicNameValuePair("client_id", "pattern"));
			params.add(new BasicNameValuePair("client_secret", "secret"));
			params.add(new BasicNameValuePair("username", username));
			params.add(new BasicNameValuePair("password", password));
			
			// Encode the parameters.
			try {
				post.setEntity(new UrlEncodedFormEntity(params));
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
			}

			// Execute the request.
			HttpResponse response = null;
			try {
				response = client.execute(post);
			} catch (ClientProtocolException e) {
				// TODO Auto-generated catch block
			} catch (IOException e) {
				// TODO Auto-generated catch block
			}
			
			// Get the input stream from the response.
			InputStream instream = null;
			try {
				instream = response.getEntity().getContent();
			} catch (IllegalStateException e) {
				// TODO Auto-generated catch block
			} catch (IOException e) {
				// TODO Auto-generated catch block
			}
			
			// Get the content from the input stream.
			BufferedReader reader = new BufferedReader(new InputStreamReader(instream));
			String content = null;
			try {
				content = reader.readLine();
			} catch (IOException e) {
				// TODO Auto-generated catch block
			}
			
			// Parse the JSON.
			JSONObject object = null;
			try {
				object = new JSONObject(content);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
			}
			
			// Check for errors.
			try {
				String error = object.getString("error");
				String error_description = object.getString("error_description");
				Log.i(TAG, "Received response with error_description: " + error_description);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
			}
			
			// Get the access_token.
			try {
				String access_token = object.getString("access_token");
				Log.i(TAG, "Received response with access_token: " + access_token);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
			}

		}
		
	}

}
