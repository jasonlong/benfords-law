#!/usr/bin/env python

import os
import subprocess

# First, build up the results file. it'll have the form:
#      110 vidioc-g-dv-preset.xml
linecount_cmd = "for i in *; do find $i -execdir wc -c '{}' \; " + \
    ">> results; done;"
os.system(linecount_cmd)

# Then figure out how many are in each bucket (linecount's initial digit)
bucket_cmd = 'for i in `jot 9`; do egrep "^[ ]*$i" results| ' + \
    'wc -l; done  > counts'
os.system(bucket_cmd)

# And how many total files there are...
total_cmd = 'wc -l results'
p = subprocess.Popen(total_cmd, stdout=subprocess.PIPE, shell=True)
(total, _) = p.communicate()

total = int(total.split()[0])

for i in file('counts', 'r').readlines():
    print 100 * (float(i) / total)

        
