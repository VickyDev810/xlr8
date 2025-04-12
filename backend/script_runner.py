import subprocess

# Replace 'your_script.sh' with the actual path to your Bash script
bash_script_path = 'script/crawler.sh'

# Run the Bash script
command = ['bash', bash_script_path, 'http://growthlist.co/funded-startups/']

# Run the Bash script using WSL
subprocess.run(command)
