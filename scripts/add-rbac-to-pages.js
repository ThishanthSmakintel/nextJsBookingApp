import fs from 'fs'
import path from 'path'

const pages = [
  { file: 'app/dashboard/customers/page.js', resource: 'customers' },
  { file: 'app/dashboard/drivers/page.js', resource: 'drivers' },
  { file: 'app/dashboard/staff/page.js', resource: 'staff' },
  { file: 'app/dashboard/reports/page.js', resource: 'reports' },
  { file: 'app/dashboard/maintenance/page.js', resource: 'maintenance' },
  { file: 'app/dashboard/leave-management/page.js', resource: 'leaves' }
]

const addRBACImports = (content) => {
  if (content.includes('PermissionButton')) return content
  
  const importIndex = content.indexOf("import { ")
  if (importIndex === -1) return content
  
  const newImports = `import PermissionButton from '@/components/PermissionButton'
import PermissionWrapper from '@/components/PermissionWrapper'
`
  
  return newImports + content
}

const wrapButtons = (content, resource) => {
  // Replace Add buttons
  content = content.replace(
    /<button className="btn btn-primary"[^>]*onClick={() => setShowModal\(true\)}[^>]*>/g,
    `<PermissionButton resource="${resource}" action="create" className="btn btn-primary" onClick={() => setShowModal(true)}>`
  )
  
  // Replace Edit buttons
  content = content.replace(
    /<button className="btn btn-sm btn-ghost"[^>]*onClick={\(\) => handleEdit[^}]*}[^>]*>/g,
    `<PermissionButton resource="${resource}" action="update" className="btn btn-sm btn-ghost" onClick={() => handleEdit`
  )
  
  // Replace Delete buttons
  content = content.replace(
    /<button className="btn btn-sm btn-ghost text-error"[^>]*onClick={\(\) => handleDelete[^}]*}[^>]*>/g,
    `<PermissionButton resource="${resource}" action="delete" className="btn btn-sm btn-ghost text-error" onClick={() => handleDelete`
  )
  
  return content
}

pages.forEach(({ file, resource }) => {
  const filePath = path.join(process.cwd(), file)
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8')
    
    // Add imports
    content = addRBACImports(content)
    
    // Wrap buttons
    content = wrapButtons(content, resource)
    
    // Wrap modals
    content = content.replace(
      /{showModal && \(\s*<div className="modal modal-open">\s*<div className="modal-box">/g,
      `{showModal && (
        <PermissionWrapper resource="${resource}" action={editing ? 'update' : 'create'}>
          <div className="modal modal-open">
            <div className="modal-box">`
    )
    
    content = content.replace(
      /\s*<\/div>\s*<\/div>\s*\)}/g,
      `            </div>
          </div>
        </PermissionWrapper>
      )}`
    )
    
    fs.writeFileSync(filePath, content)
    console.log(`✅ Added RBAC to ${file}`)
  } else {
    console.log(`❌ File not found: ${file}`)
  }
})

console.log('🎉 RBAC integration complete!')