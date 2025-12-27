import re

def extract_sql_blocks(md_path, sql_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    sql_blocks = []
    in_sql_block = False
    current_block = []
    block_start_line = 0
    
    for line_num, line in enumerate(lines, 1):
        # Check for SQL block start
        if line.strip() == '```sql':
            in_sql_block = True
            current_block = []
            block_start_line = line_num
            continue
        
        # Check for SQL block end
        if line.strip().startswith('```') and in_sql_block:
            in_sql_block = False
            # Join and add block if it's not empty
            block_text = ''.join(current_block).strip()
            if block_text:
                sql_blocks.append(block_text)
                if 'event_relays' in block_text:
                    print(f"  → Found event_relays block at line {block_start_line}")
            continue
        
        # Collect SQL lines
        if in_sql_block:
            current_block.append(line)
    
    # Write output
    header = """-- Auto-generated from documentation
-- Para Shooting Committee of India Platform
-- Database: PostgreSQL 16+

"""
    
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write(header)
        f.write('\n\n'.join(sql_blocks))
    
    print(f"✓ Extracted {len(sql_blocks)} SQL blocks to {sql_path}")
    return len(sql_blocks)

if __name__ == '__main__':
    count = extract_sql_blocks(
        r'docs\database\01-schema.md',
        r'infrastructure\database\01-init.sql'
    )
