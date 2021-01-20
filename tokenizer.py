#!/usr/bin/env python3

import os
import glob
import re
import subprocess
import itertools
import pickle
from tqdm import tqdm
import multiprocessing as mp

import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize

def format_code(string):
    string = re.sub(re.compile("\"(.+?)\""), " STR ", string)
    string = re.sub(re.compile(" 0x[0-9a-fA-F]{40}"), " ADDR ", string)
    string = re.sub(re.compile(" -?(0x)?\d+"), " NUM ", string)
    #  string = re.sub(re.compile("(?<= |\[)_+(?=\w+)"), "", string)
    string = re.sub(re.compile("(\.|\+\+|--)"), r" \1 ", string)
    return string

def remove_comments(string):
    # remove all occurrences streamed comments (/*COMMENT */) from string
    string = re.sub(re.compile("/\*.*?\*/", re.DOTALL), "", string)
    # remove all occurrence single-line comments (//COMMENT\n ) from string
    string = re.sub(re.compile("//.*?\n"), "\n", string)
    return string

def extract_functions(string):
    funcs = ('function', 'modifier', 'constructor', 'fallback', 'receive')
    listt = re.compile(" (?={} )".format(' |'.join(funcs))).split(string)
    listt = [l[:l.rindex('}')+1] for l in listt[1:-1]] + [listt[-1].strip()[:-1]]
    return listt

def replace_false_positive(listt):
    patterns = ('<=', '>=', '=>')
    indexes = []
    for i, (a, b) in enumerate(zip(listt[:-1], listt[1:])):
        if a + b in patterns:
            indexes.append((i, a + b))
    for i, p in indexes[::-1]:
        listt.pop(i + 1)
        listt.pop(i)
        listt.insert(i, p)
    return listt

def split_variable(string):
    string = re.sub('([A-Z][a-z]+)', r' \1', re.sub('([A-Z]+)', r' \1', string)).split()
    return string

def to_lower(listt):
    fixed = ('NUM', 'STR', 'ADDR')
    result = []
    for s in listt:
        if s in fixed:
            result.append('「{}」'.format(s))
        elif s == '_':
            result.append('_')
        else:
            result.append(s.strip('_').lower())
    return result

def flatten_list(listt):
    return list(itertools.chain(*listt))

def tokenize_file(content, preview=False):
    formatted = format_code(content)
    nocomments = remove_comments(formatted)
    chunks = extract_functions(nocomments)
    container = []
    for chunk in chunks:
        tokens = word_tokenize(chunk)
        tokens = replace_false_positive(tokens)
        splitted = flatten_list(map(split_variable, tokens))
        lower = to_lower(splitted)
        sentence = ' '.join(lower)
        if preview:
            print('---------\n', sentence)
        container.append(sentence)
    return container

def single_task(source):
    target = source.replace('comments', 'tokens').replace('.sol', '.txt')
    if os.path.exists(target):
        return
    with open(source) as f:
        content = f.read()
    try:
        sentence = tokenize_file(content)[0]
    except Exception as e:
        print('Error handing this file:', source)
        print(e)
        return
    folder = target[:target.rindex('/')]
    if not os.path.exists(folder):
        os.makedirs(folder)
    with open(target, 'w') as f:
        f.write(sentence.strip())

def main():
    filenames = glob.glob('contracts/funcs_comments_v11122020/*/*.sol')
    num_records = len(filenames)
    with mp.Pool(mp.cpu_count()) as pool:
        for _ in tqdm(pool.imap_unordered(single_task, filenames), total=num_records):
            pass

if __name__ == '__main__':
    #  with open('test.sol') as f:
    #      content = f.read()
    #  tokenize_file(content, preview=True)
    main()

