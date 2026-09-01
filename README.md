# Passive Voice Lens

A writing tool for Google Docs. It highlights nine patterns that make academic
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
| Unattributed claim | "studies have shown" | Which studies? |
| Unclear reference | "This suggests that..." | This what? Name the noun |
| Agreement | "data is", "amount of students" | "data are", "number of students" |
| Inflated word | "utilize", "methodology" | "use", "method" |
| Wordy phrase | "due to", "past history" | Named replacement for each |

## Option 1: Use the web version

Open the link your instructor gave you, paste your draft, click Check writing.
Nothing to install. Your text is not saved.

## Option 2: Install it in your own Google Doc

This adds a sidebar inside Google Docs, so you can click a finding and jump to
that sentence in your draft. It takes about five minutes once. You only need
two files, both in the `bundle` folder.

1. Open the Google Doc you want to check.
2. Click **Extensions**, then **Apps Script**. A new tab opens.
3. Delete everything in the `Code.gs` file that is already there.
4. Open `bundle/PassiveVoiceLens.gs` in this repository, copy all of it, and
   paste it into the empty `Code.gs`.
5. Click the **+** next to Files, choose **HTML**, and name it `Sidebar`. The
   editor adds the `.html` for you, so do not type it yourself. Paste in the
   contents of `bundle/Sidebar.html`.
6. Click the save icon.
7. In the toolbar, pick `showSidebar` from the function dropdown and click
   **Run**.
8. Google will ask for permission. Click **Review permissions**, pick your
   account, then **Advanced**, then **Go to Passive Voice Lens (unsafe)**, then
   **Allow**.

   The "unverified app" warning is expected. It appears because this script is
   not published to the Google Workspace Marketplace, not because anything is
   wrong with it. The script can only read the document you installed it in.
9. Switch back to your document. The sidebar should be open.

Reload the document once. From then on, a **Passive Voice Lens** menu appears in
the menu bar, and you can open the sidebar from there.

If you plan to write your own rules, install the separate files from the top of
the repository instead of the bundle, one script file per name, so that you can
edit them individually. See [ADDING-RULES.md](ADDING-RULES.md).

## Using the sidebar

Click **Scan document**. Each finding shows the sentence, the flagged phrase,
and a question. Click a finding to select that text in your document.

The count at the top shows findings per 100 words. Treat it as a rough signal,
not a score to minimize. A methods section will always run high, and that is
usually fine.

## Troubleshooting

**"ReferenceError: PASSIVE_RULE is not defined"** — part of the script is
missing. If you used the bundle, make sure you copied the whole file. If you
installed the separate files, check that every one of them exists and is spelled
correctly.

**"We're sorry, a server error occurred... PERMISSION_DENIED"** — you are signed
into more than one Google account. Open the document in an incognito window
signed into only the account that owns it.

**No menu after reloading** — the menu is created when the document opens, so it
only appears on the next load after you save the script. Until then, run
`showSidebar` from the Apps Script editor.

## Adding your own rules

See [ADDING-RULES.md](ADDING-RULES.md).
