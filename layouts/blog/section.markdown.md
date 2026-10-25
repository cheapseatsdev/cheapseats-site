# {{ .Title }}
{{ with .Description }}
> {{ . }}
{{ end }}
{{ with .OutputFormats.Get "rss" }}
[RSS]({{ .Permalink }})
{{ end }}
{{ .RenderShortcodes }}
{{ $summaries := index hugo.Data "blog-listing" }}
{{ range .Pages.ByDate.Reverse }}
{{ $post := . }}
{{ with .OutputFormats.Get "markdown" }}
## [{{ $post.Title }}]({{ .Permalink }})
{{ end }}

{{ .Date.Format "January 2, 2006" }}{{ with .Params.author }} · {{ . }}{{ end }}

{{ with index $summaries .File.ContentBaseName }}{{ . }}{{ else }}{{ with .Description }}{{ . }}{{ else }}{{ .Summary | plainify | truncate 220 }}{{ end }}{{ end }}
{{ end }}
