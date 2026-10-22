{{- /* screenshot.html as markdown: the light image, then the caption. */ -}}
![{{ .Get "alt" }}]({{ printf "images/docs/%s-light.webp" (.Get "name") | absURL }})
{{- with .Get "caption" }}

*{{ . }}*
{{- end }}
