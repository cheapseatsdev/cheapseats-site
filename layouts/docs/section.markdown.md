# {{ .Title }}
{{ with .Description }}
> {{ . }}
{{ end }}
{{ .RenderShortcodes }}
{{ $pages := .Pages.ByWeight }}
{{ range $g := site.Params.docGroups }}
{{ with where $pages "Params.group" $g }}
## {{ $g }}

{{ partial "landing-links.html" (dict "pages" . "format" "markdown") | htmlUnescape }}
{{ end }}
{{ end }}
