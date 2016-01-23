{
   "AWSTemplateFormatVersion" : "2010-09-09",
   "Description" : "Stack for CI/CD build pipeline for Infosys Consulting",
   "Parameters"	  : {
	   "StackVersion" :{
		   "Default" : "2015-01-22",
		   "Type" : "String",
		   "Description" : "New Stack"
	   },
	   "EnviromentName" : {
			"Description" : "EnviromentType",
			"Default"	: "Demo",
			"Type"		: "String"
	   },
	   "DemoEnvAMI"	: {
		   "Default" :	"ami-48d38c2b",
		   "Type" : 	"String",
		   "Description" :	"AMI for Demo Env for Infosys Consulting"
	   },
	 "KeyName"	:{
		 "Default" : "CICD-Demo-IC",
		 "Type" : "String",
		 "Description" : "Key to Access Demo Env Ec2 Instances"
	 },
	 "DefaultSecurityGroup" :{
		 "Default" : "sg-4e99932b",
		 "Type" : "List<AWS::EC2::SecurityGroup::Id>",
		 "Description" : "Default SG for all the Ec2 Instances"
	 },
	 "DefaultSubnet" :{
		 "Default" : "subnet-82b86ae7",
		 "Type" : "String",
		 "Description" : "Subnets for Ec2 Instances"
	 }
   },
   "Resources" : {
	   "BuildServerInstance"                      : {
            "Type" : "AWS::EC2::Instance",
			"Metadata" : {
				"AWS::CloudFormation::Init" : {
					"config" : {
						"packages" : {
							"yum" : {
								"ruby-devel"    : [],
								"gcc"           : [],
								"make"          : [],
								"rubygems"      : [],
								"telnet"		: [],
								"nmap"			: [],
								"jenkins"		: [],
								"git"			: []
							},
							"rubygems" : {
								"json"          : [],
								"bundle"          : [],
								"io-console"          : [],
								"unicorn"          : []
							}
						},
						"services"	: {
							"sysvinit" : {  
								"jenkins" : {
									"enabled" : "true",
									"ensureRunning" : "true"                
								}
							}
						}	
					}
				
				}
			},
            "Properties" : {
                "Monitoring" : "true",
                "Tags"       : [
                    {
                        "Key" : "Name",
                        "Value" : {
                            "Fn::Join" : [
                                "",
                                [
                                    "Build Server ",
                                    {
                                        "Ref" : "EnviromentName"
                                    },
                                    " Instance"
                                ]
                            ]
                        }
                    }
                ],
                "ImageId"    : {
                    "Ref" : "DemoEnvAMI"
                },
                "KeyName"    : {
                    "Ref" : "KeyName"
                },
				"EbsOptimized"        : false,
                "DisableApiTermination" : false,
                "InstanceType"          : "t2.micro",
				"NetworkInterfaces"     : [
                    {
                        "AssociatePublicIpAddress" : true,
						"DeleteOnTermination"      : true,
                        "DeviceIndex"              : "0",
						"SubnetId"                 : {
                            "Ref" : "DefaultSubnet"
                        },
						"GroupSet"                 : {
                            "Ref" : "DefaultSecurityGroup"
                        }
                        
                    }
                ],
				
 				"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
					"#!/bin/bash -xe\n",
					"yum update -y\n",
					"yum update -y aws-cfn-bootstrap\n",
					"wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo \n",
					"rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key \n",
					"# Install the files and packages from the metadata\n",
					"/opt/aws/bin/cfn-init -v ",
					"         --stack ", { "Ref" : "AWS::StackName" },
					"         --resource BuildServerInstance ",
					"         --region ", { "Ref" : "AWS::Region" }, "\n"
								
				]]}}
			}			
        }
		
   },
    "Outputs"                  : {
    }
}
 
  
	
