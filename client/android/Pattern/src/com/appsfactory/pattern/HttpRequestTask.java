package com.appsfactory.pattern;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.AsyncTask;
import android.util.Log;

interface HttpRequestTaskListener {
	public void onReceivedResponse(String uri, String response);
}

public class HttpRequestTask extends AsyncTask<Void, Void, Void> {
	private static final String TAG = "HttpRequestTask";
	
	private String uri;
	private String method;
	private ArrayList<NameValuePair> params;
	private String response;
	private HttpRequestTaskListener callback;

	public HttpRequestTask(String uri, String method, ArrayList<NameValuePair> params, HttpRequestTaskListener callback) {
		this.uri = uri;
		this.method = method;
		this.params = params;
		this.callback = callback;
	}

	@Override
	protected Void doInBackground(Void... params) {
		HttpClient client = new DefaultHttpClient();
		HttpRequestBase request = null;
		
		// Create the request.
		String method = this.method.toLowerCase();
		if (method == "post") {
			request = new HttpPost(this.uri);
		} else {
			request = new HttpGet(this.uri);
		}
		
		// Encode the parameters when the request is an HttpPost.
		if (request instanceof HttpPost) {
			try {
				HttpPost post = (HttpPost) request;
				post.setEntity(new UrlEncodedFormEntity(this.params));
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
			}
		}

		// Execute the request.
		HttpResponse response = null;
		try {
			response = client.execute(request);
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
		} catch (IOException e) {
			// TODO Auto-generated catch block
		}
		
		// Get the input stream from the response entity.
		InputStream instream = null;
		try {
			instream = response.getEntity().getContent();
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
		} catch (IOException e) {
			// TODO Auto-generated catch block
		}
		
		// Get the content from the input stream.
		// Note: strings added to null begin with "null", so the response string should be initialized as an empty string.
		BufferedReader reader = new BufferedReader(new InputStreamReader(instream));
		this.response = "";
		try {
			String line = "";
			while ((line = reader.readLine()) != null) {
				this.response += line;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
		}
				
		// Close the input stream.
		try {
			instream.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
		}
		
		return null;
	}
	
	@Override
	protected void onPostExecute(Void result) {
		// Execute the received response callback function.
		this.callback.onReceivedResponse(this.uri, this.response);
	}
	
}
