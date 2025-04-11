#!/bin/bash



start_url=$1

output_directory="download/"

rm -rf  "$output_directory"
# Create output directory if it doesn't exist
mkdir -p "$output_directory"

# Download HTML page
wget -P "$output_directory" "$start_url"

# Download linked resources (images, stylesheets, scripts)
# wget -P "$output_directory" -nd -H -p -A jpg,jpeg,png,gif,css,js "$start_url"

# download
wget -P  "angelist_data" "https://drive.google.com/file/d/10o9eX-d9MnIrVph17f6zXA3uqeNnm1vo/view?usp=sharing"