# {{ .Title }}
{{ with .Description }}
> {{ . }}
{{ end }}
{{ .RenderShortcodes }}

## Pages
{{ range .Pages.ByWeight }}
{{- $p := . }}
{{- with .OutputFormats.Get "markdown" }}
- [{{ $p.Title }}]({{ .Permalink }}){{ with $p.Description }}: {{ . }}{{ end }}
{{- end }}
{{- end }}
