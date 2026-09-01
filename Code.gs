/**
 * Passive Voice Lens -- entry points and the bridge between rule findings
 * and Google Docs text ranges.
 */

const SIDEBAR_TITLE = 'Passive Voice Lens'
const SCANNABLE_TYPES = ['PARAGRAPH', 'LIST_ITEM']

/**
 * Top-level menu. When published as a real add-on, swap createMenu(...) for
 * createAddonMenu() so the entry nests under Extensions instead.
 */
function onOpen () {
  DocumentApp.getUi()
    .createMenu(SIDEBAR_TITLE)
    .addItem('Show sidebar', 'showSidebar')
    .addToUi()
}

function onInstall () {
  onOpen()
}

function showSidebar () {
  try {
    const html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle(SIDEBAR_TITLE)
    DocumentApp.getUi().showSidebar(html)
  } catch (error) {
    throw new Error('Could not open the sidebar: ' + error.message)
  }
}

/**
 * Analyze every paragraph in the open document.
 * Offsets stay paragraph-relative because Docs ranges are built per element.
 * @returns {{findings: Array<Object>, wordCount: number, density: string}}
 */
function scanDocument () {
  try {
    const body = DocumentApp.getActiveDocument().getBody()
    const total = body.getNumChildren()
    const collected = []
    let wordCount = 0

    for (let index = 0; index < total; index += 1) {
      const child = body.getChild(index)
      if (SCANNABLE_TYPES.indexOf(child.getType().toString()) === -1) continue

      const text = child.asText().getText()
      if (text.trim().length === 0) continue

      wordCount += countWords(text)
      analyzeText(text, 0).forEach(function (finding) {
        collected.push(withLocation(finding, index))
      })
    }

    return {
      findings: collected,
      wordCount: wordCount,
      density: densityPerHundred(collected.length, wordCount)
    }
  } catch (error) {
    throw new Error('Could not scan this document: ' + error.message)
  }
}

/**
 * Select a finding's text in the document so the writer sees it in context.
 * @param {number} childIndex body child index the finding came from
 * @param {number} start paragraph-relative start offset
 * @param {number} end paragraph-relative end offset, exclusive
 */
function selectFinding (childIndex, start, end) {
  try {
    const doc = DocumentApp.getActiveDocument()
    const element = doc.getBody().getChild(childIndex).asText()
    const range = doc.newRange()
      .addElement(element, start, end - 1)
      .build()
    doc.setSelection(range)
  } catch (error) {
    throw new Error('Could not jump to that sentence: ' + error.message)
  }
}

function withLocation (finding, childIndex) {
  return Object.assign({}, finding, { childIndex: childIndex })
}

function countWords (text) {
  const trimmed = text.trim()
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length
}

function densityPerHundred (count, wordCount) {
  if (wordCount === 0) return '0.0'
  return (count / wordCount * 100).toFixed(1)
}

/**
 * Web app entry point. Lets students check a draft without installing
 * anything, which matters when Cloud projects are restricted and no add-on
 * can be published.
 */
function doGet () {
  return HtmlService.createHtmlOutputFromFile('WebApp')
    .setTitle(SIDEBAR_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
}

/**
 * Analyze pasted text. Nothing is stored or logged by this function.
 * @param {string} text
 * @returns {{findings: Array<Object>, wordCount: number, density: string}}
 */
function analyzeDraft (text) {
  try {
    if (typeof text !== 'string' || text.trim().length === 0) {
      return { findings: [], wordCount: 0, density: '0.0' }
    }
    const findings = analyzeText(text, 0)
    const wordCount = countWords(text)
    return {
      findings: findings,
      wordCount: wordCount,
      density: densityPerHundred(findings.length, wordCount)
    }
  } catch (error) {
    throw new Error('Could not analyze that text: ' + error.message)
  }
}
