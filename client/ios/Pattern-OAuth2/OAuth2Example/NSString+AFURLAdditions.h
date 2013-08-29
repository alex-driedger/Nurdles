//
//  NSString+AFURLAdditions.h
//  OAuth2Example
//
//  Created by Lucas Gladding on 8/27/13.
//  Copyright (c) 2013 Apps Factory. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString (AFURLAdditions)

- (NSDictionary *)parsedQueryString;

@end
