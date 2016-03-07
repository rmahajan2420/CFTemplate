{
    "AWSTemplateFormatVersion" : "2010-09-09",
    "Parameters"               : {
       "WebServerPort" : {
			"Description" : "TCP/IP port of the web server",
			"Type" : "String",
			"Default" : "80"
		},
		"StackVersion" : {
            "Default" : "15-06-2015",
            "Type"    : "String",
            "Description" : ""
        },
        "EnviromentName" : {
            "Description" : "Environment type.",
            "Default"     : "swm-prod",
            "Type"        : "String",
            "AllowedValues" : [
                "swm-staging",
				"swm-prod"
			],
            "ConstraintDescription" : "must specify : swm-staging, swm-prod"
        }
    },
    "Description"              : "Cloudformation for VTAC AWS environment",
    "Resources"                : {
        "VPC2Region" : {
            "Type" : "AWS::EC2::VPC",
            "Properties" : {
                "CidrBlock" : "12.0.0.0/16",
                "EnableDnsSupport" : true,
                "EnableDnsHostnames" : true,
                "Tags"               : [
                    {
                        "Key" : "Name",
                        "Value" : {
                            "Fn::Join" : [
                                "",
                                [
                                    "Cloud VPC",
                                    {
                                        "Ref" : "EnviromentName"
                                    }
                                ]
                            ]
                        }
                    }
                ]
          }
        },
        "AttachInternetGateway" : {
            "Type" : "AWS::EC2::VPCGatewayAttachment",
            "Properties" : {
                "VpcId" : {
                    "Ref" : "VPC2Region"
                },
                "InternetGatewayId" : {
                    "Ref" : "InternetGateway"
                }
            }
        },
        "InternetGateway" : {
            "Type" : "AWS::EC2::InternetGateway",
            "Properties" : {
                "Tags" : [
                    {
                        "Key" : "Name",
                        "Value" : {
                            "Ref" : "EnviromentName"
                        }
                    }
                ]
            }
        }
    },
    "Outputs" : {
    "VPCID" : {
      "Description" : "The ID of the VPC",
      "Value" :  { "Ref" : "VPC2Region"}
    }, 
    "InternetgatewayID" : {
      "Description" : "The ID of the Gateway",
      "Value" :  { "Ref" : "InternetGateway"}
        }
    }

    
}

    