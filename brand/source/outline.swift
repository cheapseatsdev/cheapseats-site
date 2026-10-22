import Foundation
import CoreText
import CoreGraphics

func outline(_ text: String, _ name: String, _ size: CGFloat) -> [String: Any] {
    let font = CTFontCreateWithName(name as CFString, size, nil)
    let string = NSAttributedString(string: text, attributes: [NSAttributedString.Key(kCTFontAttributeName as String): font])
    let line = CTLineCreateWithAttributedString(string)
    let combined = CGMutablePath()
    for run in CTLineGetGlyphRuns(line) as! [CTRun] {
        let count = CTRunGetGlyphCount(run)
        var glyphs = [CGGlyph](repeating: 0, count: count)
        var positions = [CGPoint](repeating: .zero, count: count)
        CTRunGetGlyphs(run, CFRange(location: 0, length: 0), &glyphs)
        CTRunGetPositions(run, CFRange(location: 0, length: 0), &positions)
        for i in 0..<count {
            if let path = CTFontCreatePathForGlyph(font, glyphs[i], nil) {
                combined.addPath(path, transform: CGAffineTransform(translationX: positions[i].x, y: positions[i].y))
            }
        }
    }
    let b = combined.boundingBoxOfPath
    let transform = CGAffineTransform(a: 1, b: 0, c: 0, d: -1, tx: -b.minX, ty: b.maxY)
    let normalized = CGMutablePath()
    normalized.addPath(combined, transform: transform)
    var commands = [String]()
    func n(_ x: CGFloat) -> String { String(format: "%.3f", Double(x)) }
    func point(_ p: CGPoint) -> String { "\(n(p.x)) \(n(p.y))" }
    normalized.applyWithBlock { element in
        let e = element.pointee
        switch e.type {
        case .moveToPoint: commands.append("M" + point(e.points[0]))
        case .addLineToPoint: commands.append("L" + point(e.points[0]))
        case .addQuadCurveToPoint: commands.append("Q" + point(e.points[0]) + " " + point(e.points[1]))
        case .addCurveToPoint: commands.append("C" + point(e.points[0]) + " " + point(e.points[1]) + " " + point(e.points[2]))
        case .closeSubpath: commands.append("Z")
        @unknown default: break
        }
    }
    return ["d": commands.joined(), "width": b.width, "height": b.height, "font": name]
}
let result = ["wordmark": outline("Cheap Seats", "AvenirNext-Bold", 100), "domain": outline("cheapseats.dev", "AvenirNext-Medium", 36)]
let data = try JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys])
try data.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))
