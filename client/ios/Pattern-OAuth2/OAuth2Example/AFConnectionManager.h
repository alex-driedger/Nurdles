//
//  AFConnectionManager.h
//  Pattern
//
//  Created by Lucas Gladding on 8/22/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import <Foundation/Foundation.h>


@class AFConnectionManager;


@protocol AFConnectionManagerDelegate <NSObject>

- (void)manager:(AFConnectionManager *)manager didReceiveResponse:(NSHTTPURLResponse *)response data:(NSData *)data;

@optional

- (void)manager:(AFConnectionManager *)manager didFailWithError:(NSError *)error;

@end


@interface AFConnectionManager : NSObject <NSURLConnectionDataDelegate>

@property (strong, nonatomic) id <AFConnectionManagerDelegate> delegate;

+ (AFConnectionManager *)connectionWithURLWithString:(NSString *)URLString
                                             headers:(NSDictionary *)headers
                                              method:(NSString *)method
                                          parameters:(NSDictionary *)params
                                            delegate:(id <AFConnectionManagerDelegate>)delegate;

+ (AFConnectionManager *)authenticatedConnectionWithURLWithString:(NSString *)URLString
                                                          headers:(NSDictionary *)headers
                                                           method:(NSString *)method
                                                       parameters:(NSDictionary *)params
                                                         delegate:(id <AFConnectionManagerDelegate>)delegate;

@end
