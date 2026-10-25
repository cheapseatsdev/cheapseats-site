{{- /* screenshot.html as markdown: the light image, then the caption. */ -}}
![{{ .Get "alt" }}]({{ printf "images/docs/%s-light.%s" (.Get "name") (.Get "format" | default "webp") | absURL }})
{{- with .Get "caption" }}

*{{ . }}*
{{- end }}
