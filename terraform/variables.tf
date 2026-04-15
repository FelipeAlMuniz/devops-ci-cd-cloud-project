variable "project_name" {
  description = "Base name applied to all AWS resources."
  type        = string
  default     = "devops-cloud-project"
}

variable "aws_region" {
  description = "AWS region used to provision the environment."
  type        = string
  default     = "us-east-1"
}

variable "container_port" {
  description = "Application port exposed by the container."
  type        = number
  default     = 5000
}

variable "container_image" {
  description = "Container image URI pushed to Amazon ECR."
  type        = string
}

variable "cpu" {
  description = "CPU units used by the ECS task definition."
  type        = number
  default     = 256
}

variable "memory" {
  description = "Memory in MiB used by the ECS task definition."
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Desired number of ECS tasks."
  type        = number
  default     = 1
}

variable "environment" {
  description = "Deployment environment label."
  type        = string
  default     = "production"
}
