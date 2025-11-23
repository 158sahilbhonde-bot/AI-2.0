import fs from 'fs';
import path from 'path';

// Path to your JSON file
const jsonFilePath = path.join(process.cwd(), 'src/assets/medical_conditions_complete_database.json');

console.log('Reading JSON file...');
let jsonContent = fs.readFileSync(jsonFilePath, 'utf8');

console.log('Original file size:', jsonContent.length, 'characters');

// Count problematic characters before cleaning
const pilcrowCount = (jsonContent.match(/¶/g) || []).length;
console.log('Found ¶ characters:', pilcrowCount);

// Replace invalid/special characters
let cleanedContent = jsonContent
    // Replace pilcrow (¶) with em dash or hyphen
    .replace(/¶/g, '—')
    // Replace other common problematic characters
    .replace(/'/g, "'")  // Smart single quotes
    .replace(/'/g, "'")
    .replace(/"/g, '"')  // Smart double quotes
    .replace(/"/g, '"')
    .replace(/…/g, '...')  // Ellipsis
    .replace(/–/g, '-')  // En dash
    // Remove any other non-printable or invalid JSON characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

console.log('Cleaned file size:', cleanedContent.length, 'characters');

// Try to parse to validate
try {
    const parsed = JSON.parse(cleanedContent);
    console.log('✓ JSON is valid!');
    console.log('Total conditions:', parsed.conditions?.length || 'N/A');
    
    // Save the cleaned version
    const backupPath = jsonFilePath + '.backup';
    const cleanedPath = jsonFilePath.replace('.json', '_cleaned.json');
    
    // Create backup of original
    console.log('Creating backup...');
    fs.writeFileSync(backupPath, jsonContent);
    
    // Save cleaned version
    console.log('Saving cleaned version...');
    fs.writeFileSync(cleanedPath, cleanedContent);
    
    console.log('✓ Done!');
    console.log('Backup saved to:', backupPath);
    console.log('Cleaned file saved to:', cleanedPath);
    
} catch (error) {
    console.error('✗ JSON is still invalid after cleaning:', error.message);
    
    // Try to find the exact position of the error
    if (error.message.includes('position')) {
        const match = error.message.match(/position (\d+)/);
        if (match) {
            const pos = parseInt(match[1]);
            const context = cleanedContent.substring(Math.max(0, pos - 50), Math.min(cleanedContent.length, pos + 50));
            console.log('Context around error position:');
            console.log(context);
        }
    }
    
    // Save the partially cleaned version anyway for manual inspection
    const partialPath = jsonFilePath.replace('.json', '_partial_clean.json');
    fs.writeFileSync(partialPath, cleanedContent);
    console.log('Partially cleaned file saved to:', partialPath);
}