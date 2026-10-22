---
url: {{ .Permalink }}
{{- if not .Date.IsZero }}
date: {{ .Date.Format "2006-01-02" }}
{{- end }}
{{- with .Description }}
description: {{ . }}
{{- end }}
---

# {{ .Title }}

{{ .RenderShortcodes }}
