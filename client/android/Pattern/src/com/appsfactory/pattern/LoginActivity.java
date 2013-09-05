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
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

interface AuthenticateTaskListener {
	public void onAuthenticateSuccess(String access_token);
	public void onAuthenticateFailure(String error_description);
}

public class LoginActivity extends Activity implements OnClickListener, AuthenticateTaskListener {
	// Declare the instance variables.
	private EditText usernameEditText;
	private EditText passwordEditText;
	private Button authenticateButton;
	private TextView statusTextView;

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
		String username = usernameEditText.getText().toString();
		String password = passwordEditText.getText().toString();
		new AuthenticateTask(this).execute(username, password);
		
		// Clear the status from the previous authentication.
		statusTextView.setText("");
	}
	
	@Override
	public void onAuthenticateSuccess(String access_token) {
		statusTextView.setText(R.string.authenticate_success);
	}
	
	@Override
	public void onAuthenticateFailure(String error_description) {
		statusTextView.setText(R.string.authenticate_failure);
	}
	
	// Define the types used for the task.
	// Params: the type used for the doInBackground() variable arguments
	// Progress: the type used for the onProgressUpdate() argument
	// Result: the type used for the onPostExecute() argument
	class AuthenticateTask extends AsyncTask<String, Void, Void> {
		private static final String BASE_URL = "http://10.172.69.51:4010";
		private static final String ACCESS_TOKEN_URL = "/oauth/authorize/token";
		
		// Declare the instance variables.
		private String access_token;
		private AuthenticateTaskListener callback;
		private String error_description;
		
		// Constructor
		public AuthenticateTask(AuthenticateTaskListener callback) {
			this.callback = callback;
		}
		
		// AsyncTask implementation
		
		@Override
		protected Void doInBackground(String... params) {
			String username = null;
			String password = null;
			
			// Get the username and password from the arguments array.
			if (params.length >= 2) {
				username = params[0];
				password = params[1];
			} else {
				return null;
			}
			
			// Authenticate the user.
			try {
				authenticate(username, password);
			} catch (Exception e) {
				// TODO Auto-generated catch block
			}
			
			return null;
		}
		
		@Override
		protected void onPostExecute(Void result) {
			if (this.access_token != null) {
				this.callback.onAuthenticateSuccess(this.access_token);
			} else {
				this.callback.onAuthenticateFailure(this.error_description);
			}
		}
		
		// Authentication
		
		protected Void authenticate(String username, String password) {
			// Create the client and the request.
			HttpClient client = new DefaultHttpClient();
			HttpPost post = new HttpPost(BASE_URL + ACCESS_TOKEN_URL);
			
			// Create the parameters list.
			List<NameValuePair> params = new ArrayList <NameValuePair> ();
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
			String content = new String();
			try {
				String line = null;
				while ((line = reader.readLine()) != null) {
					content += line;
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
			}
			
			// Close the input stream.
			try {
				instream.close();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
			}
			
			// Create the JSON object.
			JSONObject object = null;
			try {
				object = new JSONObject(content);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
			}
			
			// Get the access_token.
			try {
				this.access_token = object.getString("access_token");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
			}
			
			// Get the error_description.
			try {
				this.error_description = object.getString("error_description");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
			}
			
			return null;

		}
		
	}

}
