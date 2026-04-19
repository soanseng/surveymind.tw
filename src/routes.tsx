import type { RouteRecord } from "vite-react-ssg";
import App from "./App";
import HomePage from "./pages/home";
import NotFoundPage from "./pages/not-found";
import Ad8Page from "./pages/ad-8";
import AsrsPage from "./pages/asrs";
import AuditPage from "./pages/audit";
import BesPage from "./pages/bes";
import Big5Page from "./pages/big-5";
import CdrPage from "./pages/cdr";
import EdeQPage from "./pages/ede-q";
import FastPage from "./pages/fast";
import FibromyalgiaPage from "./pages/fibromyalgia";
import FtndPage from "./pages/ftnd";
import GadPage from "./pages/gad";
import Hcl32Page from "./pages/hcl-32";
import Igds9SfPage from "./pages/igds9-sf";
import IsiPage from "./pages/isi";
import MidasPage from "./pages/midas";
import MsiBpdPage from "./pages/msi-bpd";
import OcirPage from "./pages/oci-r";
import Pcl5Page from "./pages/pcl-5";
import PcPtsd5Page from "./pages/pc-ptsd-5";
import PgsiPage from "./pages/pgsi";
import Phq9Page from "./pages/phq-9";
import PsqiPage from "./pages/psqi";
import SasPage from "./pages/sas";
import SastPage from "./pages/sast";
import ScoffPage from "./pages/scoff";
import SlumsPage from "./pages/slums";
import Snap4Page from "./pages/snap-4";
import SpmsqPage from "./pages/spmsq";
import TdqPage from "./pages/tdq";

export const questionnaireRoutes = [
  "ad-8",
  "asrs",
  "audit",
  "bes",
  "big-5",
  "cdr",
  "ede-q",
  "fast",
  "fibromyalgia",
  "ftnd",
  "gad",
  "hcl-32",
  "igds9-sf",
  "isi",
  "midas",
  "msi-bpd",
  "oci-r",
  "pcl-5",
  "pc-ptsd-5",
  "pgsi",
  "phq-9",
  "psqi",
  "sas",
  "sast",
  "scoff",
  "slums",
  "snap-4",
  "spmsq",
  "tdq",
] as const;

export const routes: RouteRecord[] = [
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: HomePage },
      { path: "ad-8", Component: Ad8Page },
      { path: "asrs", Component: AsrsPage },
      { path: "audit", Component: AuditPage },
      { path: "bes", Component: BesPage },
      { path: "big-5", Component: Big5Page },
      { path: "cdr", Component: CdrPage },
      { path: "ede-q", Component: EdeQPage },
      { path: "fast", Component: FastPage },
      { path: "fibromyalgia", Component: FibromyalgiaPage },
      { path: "ftnd", Component: FtndPage },
      { path: "gad", Component: GadPage },
      { path: "hcl-32", Component: Hcl32Page },
      { path: "igds9-sf", Component: Igds9SfPage },
      { path: "isi", Component: IsiPage },
      { path: "midas", Component: MidasPage },
      { path: "msi-bpd", Component: MsiBpdPage },
      { path: "oci-r", Component: OcirPage },
      { path: "pcl-5", Component: Pcl5Page },
      { path: "pc-ptsd-5", Component: PcPtsd5Page },
      { path: "pgsi", Component: PgsiPage },
      { path: "phq-9", Component: Phq9Page },
      { path: "psqi", Component: PsqiPage },
      { path: "sas", Component: SasPage },
      { path: "sast", Component: SastPage },
      { path: "scoff", Component: ScoffPage },
      { path: "slums", Component: SlumsPage },
      { path: "snap-4", Component: Snap4Page },
      { path: "spmsq", Component: SpmsqPage },
      { path: "tdq", Component: TdqPage },
      { path: "404.html", Component: NotFoundPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
];
