//
//  AFConnectionManager.m
//  Pattern
//
//  Created by Lucas Gladding on 8/22/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import "AFConnectionManager.h"

@interface AFConnectionManager ()

@property (strong, nonatomic) NSURLConnection *connection;
@property (strong, nonatomic) NSHTTPURLResponse *response;
@property (strong, nonatomic) NSMutableData *data;

@end

@implementation AFConnectionManager

+ (AFConnectionManager *)connectionWithURLWithString:(NSString *)URLString
                                             headers:(NSDictionary *)headers
                                              method:(NSString *)method
                                          parameters:(NSDictionary *)params
                                            delegate:(id <AFConnectionManagerDelegate>)delegate
{
    AFConnectionManager *manager = [[AFConnectionManager alloc] init];
    
    // Set the delegate.
    manager.delegate = delegate;
    
    // Create the URL.
    NSURL *URL = [NSURL URLWithString:URLString];

    // Create and configure the request. The content type is required.
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:URL];
    [request setAllHTTPHeaderFields:headers];
    
    // Set the request method and parameters.
    request.HTTPMethod = method;
    request.HTTPBody = [NSJSONSerialization dataWithJSONObject:params options:0 error:0];
    
    // Initialize the data recipient.
    manager.data = [NSMutableData dataWithCapacity:0];
    
    // Create the connection and send the request.
    NSURLConnection *connection = [NSURLConnection connectionWithRequest:request delegate:manager];
    manager.connection = connection;
    
    return manager;
}

#pragma mark - URL connection data delegate

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    if ([response isKindOfClass:[NSHTTPURLResponse class]]) {
        self.response = (NSHTTPURLResponse *)response;
    }
    
    // NSLog(@"Connection received response: %@", self.response);
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    [self.data appendData:data];
    
    // NSLog(@"Connection received data");
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    [self.delegate manager:self didReceiveResponse:self.response data:self.data];
    
    // NSLog(@"Connection finished loading");
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error
{
    [self.delegate manager:self didFailWithError:error];
    
    // NSLog(@"Connection failed! %@, %@", error, [error userInfo]);
}

@end
