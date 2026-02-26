import pathway as pw
t1 = pw.debug.table_from_markdown('''
age | owner | pet
10  | Alice | dog
9   | Bob   | dog
8   | Alice | cat
7   | Bob   | dog
''')
isinstance(t1, pw.Table)
