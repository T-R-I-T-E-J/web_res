import re
from pathlib import Path

def extract_from_file(path):
    path = Path(path)
    if not path.exists():
        print(f"⚠️ Warning: {path} not found.")
        return []
    
    print(f"🔍 Processing {path.name}...")
    
    if path.suffix == '.sql':
        with open(path, 'r', encoding='utf-8') as f:
            return [f.read()]
    
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    blocks = []
    current = []
    in_block = False
    for line in lines:
        stripped = line.strip()
        # Handle 3 or more backticks + optional language name
        if not in_block and stripped.startswith('```') and 'sql' in stripped.lower():
            in_block = True
            current = []
            continue
        if in_block and stripped.startswith('```'):
            in_block = False
            text = ''.join(current).strip()
            if text:
                blocks.append(text)
            continue
        if in_block:
            current.append(line)
    return blocks

if __name__ == '__main__':
    base_dir = Path(__file__).parent
    docs_dir = base_dir / 'docs' / 'database'
    
    # Priority order for initialization
    files_to_extract = [
        docs_dir / '01-schema.md',            # Core tables
        docs_dir / '08-audit-logging.md',     # Audit system (Table + Function)
        docs_dir / '02-refinements.sql',      # Schema refinements & Triggers
        docs_dir / '03-seed-data.md'          # Reference & Initial data
    ]
    
    all_sql = []
    for f in files_to_extract:
        all_sql.extend(extract_from_file(f))
    
    output_path = base_dir / 'infrastructure' / 'database' / '01-init.sql'
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    header = """-- Auto-generated Master Database Initialization Script
-- Generated: 2025-12-28
-- Source: docs/database/*.md and 02-refinements.sql

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(header)
        for i, block in enumerate(all_sql):
            f.write(f"\n\n-- Block {i+1} " + "="*40 + "\n")
            f.write(block)
            if not block.strip().endswith(';'):
                f.write(';')
    
    print(f"\n✓ Master SQL generated at: {output_path}")
    print(f"✓ Total blocks extracted: {len(all_sql)}")
