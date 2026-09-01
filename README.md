# Passive Voice Lens

A writing tool for Google Docs. It highlights five patterns that make academic
prose harder to read, and for each one asks a question rather than issuing a
correction.

None of these patterns is an error. Passive voice is often the right choice,
especially in a methods section. The tool marks places worth a second look.

## What it flags

| Label | Example | Prompt |
|---|---|---|
| Passive, no actor | "the data were collected" | By whom? Does the reader need to know? |
| Passive, actor named | "were coded by two raters" | You know who acted. Make them the subject? |
| Buried verb | "performed an analysis" | Try "analyze" |
| Nominalization | "the usage of GAI" | Try "GAI usage" |
| Wordy phrase | "due to", "in order to" | Named replacement for each |

## Option 1: Use the web version

Open the link your instructor gave you, paste your draft, click Check writing.
Nothing to install. Your text is not saved.

## Option 2: Install it in your own Google Doc

This adds a sidebar inside Google Docs, so you can click a finding and jump to
that sentence in your draft. It takes about ten minutes once.

1. Open the Google Doc you want to check.
2. Click **Extensions**, then **Apps Script**. A new tab opens.
3. Delete everything in the `Code.gs` file that is already there.
4. Copy the contents of `Code.gs` from this repository and paste it in.
5. For each of these files, click the **+** next to Files, choose **Script**,
   and type the name exactly as shown (leave off the `.gs`):

   `lexicon`, `phrases`, `verbForms`, `tokenize`, `passiveRule`,
   `nominalizationRule`, `lightVerbRule`, `phraseRule`, `rules`

   Paste the matching file's contents into each one.
6. Click the **+** next to Files again, choose **HTML**, and name it `Sidebar`.
   Paste in the contents of `Sidebar.html`. The editor adds the `.html` for you,
   so do not type it yourself.
7. Click the save icon.
8. In the toolbar, pick `showSidebar` from the function dropdown and click
   **Run**.
9. Google will ask for permission. Click **Review permissions**, pick your
   account, then **Advanced**, then **Go to Passive Voice Lens (unsafe)**, then
   **Allow**.

   The "unverified app" warning is expected. It appears because this script is
   not published to the Google Workspace Marketplace, not because anything is
   wrong with it. The script can only read the document you installed it in.
10. Switch back to your document. The sidebar should be open.

Reload the document once. From then on, a **Passive Voice Lens** menu appears in
the menu bar, and you can open the sidebar from there.

`WebApp.html` and `appsscript.json` are not needed for this. They are used for
the hosted web version.

## Using the sidebar

Click **Scan document**. Each finding shows the sentence, the flagged phrase,
and a question. Click a finding to select that text in your document.

The count at the top shows findings per 100 words. Treat it as a rough signal,
not a score to minimize. A methods section will always run high, and that is
usually fine.

## Troubleshooting

**"ReferenceError: PASSIVE_RULE is not defined"** — a file is missing or
misnamed. Check that all nine script files exist and match the names in step 5.

**"We're sorry, a server error occurred... PERMISSION_DENIED"** — you are signed
into more than one Google account. Open the document in an incognito window
signed into only the account that owns it.

**No menu after reloading** — the menu is created when the document opens, so it
only appears on the next load after you save the script. Until then, run
`showSidebar` from the Apps Script editor.

## Adding your own rules

See [ADDING-RULES.md](ADDING-RULES.md).
