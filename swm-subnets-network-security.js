{
    "AWSTemplateFormatVersion" : "2010-09-09",
    "Parameters"               : {
        "StackVersion" : {
            "Default" : "2016-03-05",
            "Type"    : "String",
            "Description" : ""
        },
		"swmVPC"  : {
            "Default" : "vpc",
            "Type"    : "String",
            "Description" : "VCP ID "
        },
        "EnviromentName" : {
            "Description" : "Environment type.",
            "Default"     : "swm-prod",
            "Type"        : "String",
            "AllowedValues" : [
                "swm-prod",
				"swm-staging"
             ],
            "ConstraintDescription" : "must specify : swm-staging, swm-prod"
        },
        "VPC2AZ2a"         : {
            "Default" : "ap-southeast-2a",
            "Type"    : "String",
            "Description" : "Availability Zone"
        },
		"VPC2AZ2b"         : {
            "Default" : "ap-southeast-2b",
            "Type"    : "String",
            "Description" : "Availability Zone"
        },
		"PublicCidrBlock2a" : {
            "Default" : "12.0.0.0/24",
            "Type"    : "String",
            "Description" : "Public CDIR Block"
        },
        "PrivateCidrBlock2a" : {
            "Default" : "12.0.1.0/24",
            "Type"    : "String",
            "Description" : "Private CDIR Block"
        },
		"PrivateCidrBlock2b" : {
            "Default" : "12.0.2.0/24",
            "Type"    : "String",
            "Description" : "Private CDIR Block"
        },
		"PublicCidrBlock2b" : {
            "Default" : "12.0.3.0/24",
            "Type"    : "String",
            "Description" : "Private CDIR Block"
        },
		"swmidrBlock" : {
            "Default" : "0.0.0.0/0",
            "Type"    : "String",
            "Description" : "Private CDIR Block"
        }
		
   	},
    "Description"              : "Cloudformation creating Subnets, NetworkACL and Security Group for a parametrized Availability zone",
    "Resources"                : {
        "Tier0PublicSubnetAZ2a" : {
            "Type" : "AWS::EC2::Subnet",
            "Properties" : {
                "Tags" : [
                    {
                        "Key" : "Name",
                        "Value" : {
                            "Fn::Join" : [
                                "",
                                [
                                    {
                                        "Ref" : "EnviromentName"
                                    },
                                    "Tier0PublicSubnetAZ2a"
                                ]
                            ]
                        }
                    }
                ],
                "VpcId" : {
                    "Ref" : "swmVPC"
                },
                "CidrBlock" : {
                    "Ref" : "PublicCidrBlock2a"
                },
                "AvailabilityZone" : {
                    "Ref" : "VPC2AZ2a"
                }
            }
        },

        "Tier0SG"                                : {
            "Type" : "AWS::EC2::SecurityGroup",
            "Properties" : {
                "VpcId" : {
                    "Ref" : "swmVPC"
                },
                "GroupDescription" : {
                    "Fn::Join" : [
                        "",
                        [
                            "swm",
                            {
                                "Ref" : "EnviromentName"
                            },
                            "Stack-Tier0SG"
                        ]
                    ]
                },
                "Tags"             : [
                    {
                        "Key" : "Name",
                        "Value" : {
                            "Fn::Join" : [
                                "",
                                [
                                    "swm",
                                    {
                                        "Ref" : "EnviromentName"
                                    },
                                    "Stack-Tier0SG"
                                ]
                            ]
                        }
                    }
                ]
            }
        },
        "Tier0SG2Ingress"      : {
            "Type" : "AWS::EC2::SecurityGroupIngress",
            "Properties" : {
                "ToPort" : "65535",
                "FromPort" : "0",
                "GroupId"  : {
                    "Ref" : "Tier0SG"
                },
                "IpProtocol" : "tcp",
                "CidrIp"     : "0.0.0.0/0"
            }
        }

       



        
    },
    "Outputs"                  : {
        "Tier0PublicSubnetAZ2a" : {
            "Description" : "The ID of the Public Subnet 2a",
            "Value"       : {
                "Ref" : "Tier0PublicSubnetAZ2a"
            }
        },
        "Tier0SG" : {
            "Description" : "The Group ID of Tier0 Build SG",
            "Value"       : {
                "Ref" : "Tier0SG"
            }
        }
    }
}