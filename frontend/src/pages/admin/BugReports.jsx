import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FiRefreshCcw, FiSearch, FiTrash2 } from "react-icons/fi";
import {
  deleteBugReport,
  getBugReports,
  updateBugReportStatus,
} from "../../services/api/bugReport.service.js";
import { colors } from "../../theme/tokens.js";
import { useAdminAlert } from "../../context/AdminAlertContext.jsx";
import AppLoadingState from "../../components/common/AppLoadingState.jsx";

const STATUS_FILTERS = ["all", "open", "in_review", "resolved", "rejected"];

const statusBadgeStyle = {
  open: { bg: "#fef3c7", color: "#92400e", label: "Open" },
  in_review: { bg: "#dbeafe", color: "#1e3a8a", label: "In Review" },
  resolved: { bg: "#dcfce7", color: "#166534", label: "Resolved" },
  rejected: { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
};

const reasonLabelMap = {
  incorrect_ingredients: "Incorrect Ingredients",
  recipe_missing: "Recipe No Longer Exists",
  wrong_image: "Wrong Image",
  incorrect_cuisine: "Incorrect Cuisine",
  wrong_meal_type: "Wrong Meal Type",
  video_not_working: "Video Doesn't Work",
  other: "Other",
};

const extractApiError = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  if (error?.message) return error.message;
  return fallback;
};

export default function BugReports() {
  const { showAlert, confirm } = useAdminAlert();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [savingReportId, setSavingReportId] = useState(null);
  const [noteByReportId, setNoteByReportId] = useState({});

  const loadReports = async (filter = statusFilter) => {
    setLoading(true);
    try {
      const data = await getBugReports(filter);
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      setReports([]);
      showAlert({
        tone: "error",
        title: "Load Failed",
        description: error?.response?.data?.error || "Could not load bug reports.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reports;

    return reports.filter((report) => {
      const description = String(report.description || "").toLowerCase();
      const reasonLabel = String(
        reasonLabelMap[report.reason_code] || report.reason_code || "",
      ).toLowerCase();
      const recipeTitle = String(report.food?.title || "").toLowerCase();
      const reporterName = String(report.reporter?.name || "").toLowerCase();
      const reporterEmail = String(report.reporter?.email || "").toLowerCase();
      return (
        description.includes(query) ||
        reasonLabel.includes(query) ||
        recipeTitle.includes(query) ||
        reporterName.includes(query) ||
        reporterEmail.includes(query)
      );
    });
  }, [reports, search]);

  const handleUpdateStatus = async (report, status) => {
    setSavingReportId(report.report_id);
    try {
      const updated = await updateBugReportStatus(report.report_id, {
        status,
        admin_note: noteByReportId[report.report_id] || report.admin_note || "",
      });

      setReports((prev) =>
        prev.map((item) => (item.report_id === updated.report_id ? updated : item)),
      );
      showAlert({
        tone: "success",
        title: "Report Updated",
        description: `Status changed to ${status.replace("_", " ")}.`,
      });
    } catch (error) {
      showAlert({
        tone: "error",
        title: "Update Failed",
        description: error?.response?.data?.error || "Could not update report status.",
      });
    } finally {
      setSavingReportId(null);
    }
  };

  const handleDeleteReport = async (reportId) => {
    const confirmed = await confirm({
      tone: "error",
      title: "Delete This Report?",
      description: "This bug report will be removed permanently.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!confirmed) return;

    setSavingReportId(reportId);
    try {
      await deleteBugReport(reportId);
      setReports((prev) => prev.filter((report) => report.report_id !== reportId));
      showAlert({
        tone: "success",
        title: "Report Deleted",
        description: "The bug report has been removed.",
      });
    } catch (error) {
      showAlert({
        tone: "error",
        title: "Delete Failed",
        description: extractApiError(error, "Could not delete bug report."),
      });
    } finally {
      setSavingReportId(null);
    }
  };

  const totalReports = reports.length;
  const openReports = reports.filter((report) => report.status === "open").length;

  if (loading) {
    return (
      <AppLoadingState
        title="Loading reports"
        description="Fetching user bug reports for moderation."
        minH="320px"
      />
    );
  }

  return (
    <Box h="100%" minH={0} overflow="auto" overflowX="hidden" pr={1}>
      <Box
        w="100%"
        maxW="1180px"
        mx="auto"
        bg="whiteAlpha.900"
        border="1px solid"
        borderColor="#dbe5f4"
        boxShadow="0 10px 30px rgba(79,121,189,0.08)"
        borderRadius={{ base: "16px", md: "24px" }}
        p={{ base: 4, md: 6 }}
        minH="100%"
      >
        <Flex justify="space-between" align={{ base: "stretch", md: "center" }} gap={4} direction={{ base: "column", md: "row" }} mb={5}>
          <Box>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color={colors.darkest}>
              Bug Reports
            </Text>
            <Text color="gray.600" mt={1}>
              Review user-reported issues and keep recipe experience stable.
            </Text>
          </Box>

          <Button
            leftIcon={<FiRefreshCcw />}
            onClick={() => loadReports(statusFilter)}
            bg={colors.primary}
            color="white"
            _hover={{ bg: colors.dark }}
            borderRadius="full"
          >
            Refresh
          </Button>
        </Flex>

        <HStack mb={4} gap={3} flexWrap="wrap">
          <Badge bg="#edf4ff" color={colors.darkest} px={3} py={1.5} borderRadius="full">
            Total: {totalReports}
          </Badge>
          <Badge bg="#fff7ed" color="#9a3412" px={3} py={1.5} borderRadius="full">
            Open: {openReports}
          </Badge>
        </HStack>

        <Flex justify="space-between" align={{ base: "stretch", md: "center" }} direction={{ base: "column", md: "row" }} gap={3} mb={5}>
          <HStack gap={2} flexWrap="wrap">
            {STATUS_FILTERS.map((status) => (
              <Button
                key={status}
                size="sm"
                borderRadius="full"
                bg={statusFilter === status ? colors.primary : "#edf2fb"}
                color={statusFilter === status ? "white" : colors.darkest}
                _hover={{ bg: statusFilter === status ? colors.dark : "#dfe9fb" }}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" ? "All" : status.replace("_", " ")}
              </Button>
            ))}
          </HStack>

          <InputGroup maxW={{ base: "100%", md: "340px" }} startElement={<FiSearch size="16" color="#718096" />}>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search recipe, reporter, or issue"
              bg="white"
              borderRadius="full"
              border="1px solid"
              borderColor="#dbe5f4"
            />
          </InputGroup>
        </Flex>

        {filteredReports.length === 0 ? (
          <Box
            bg="#fbfdff"
            border="1px solid"
            borderColor="#dbe5f4"
            borderRadius="18px"
            p={10}
            textAlign="center"
          >
            <Text fontWeight="700" color={colors.darkest} mb={2}>
              No bug reports found.
            </Text>
            <Text color="gray.600">Try a different filter or check back later.</Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={4}>
            {filteredReports.map((report) => {
              const statusStyle = statusBadgeStyle[report.status] || statusBadgeStyle.open;
              const reasonLabel =
                reasonLabelMap[report.reason_code] || report.reason_code || "Other";
              const createdLabel = new Date(report.createdAt).toLocaleString();
              const handledLabel = report.handled_at
                ? new Date(report.handled_at).toLocaleString()
                : null;

              return (
                <Box
                  key={report.report_id}
                  bg="white"
                  border="1px solid"
                  borderColor="#dbe5f4"
                  borderRadius="16px"
                  p={{ base: 4, md: 5 }}
                >
                  <Flex justify="space-between" align={{ base: "start", md: "center" }} gap={3} direction={{ base: "column", md: "row" }}>
                    <HStack align="center" gap={3}>
                      {report.food?.image_url ? (
                        <Image
                          src={report.food.image_url}
                          alt={report.food?.title || "Recipe"}
                          boxSize="72px"
                          objectFit="cover"
                          borderRadius="12px"
                        />
                      ) : (
                        <Box
                          boxSize="72px"
                          borderRadius="12px"
                          bg="#e2e8f0"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="xs" color="#475569" fontWeight="700">
                            NO IMG
                          </Text>
                        </Box>
                      )}

                      <Box>
                        <Text fontWeight="700" color={colors.darkest}>
                          {report.food?.title || `Food #${report.food_id}`}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Reported by {report.reporter?.name || "Unknown User"} ({report.reporter?.email || "no-email"})
                        </Text>
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          Submitted: {createdLabel}
                        </Text>
                      </Box>
                    </HStack>

                    <Badge bg={statusStyle.bg} color={statusStyle.color} px={3} py={1} borderRadius="full">
                      {statusStyle.label}
                    </Badge>
                  </Flex>

                  <Box mt={4} bg="#f8fbff" borderRadius="12px" p={3} border="1px solid" borderColor="#e5edfa">
                    <Badge bg="#eef2ff" color="#3730a3" px={2.5} py={1} borderRadius="full" mb={2}>
                      {reasonLabel}
                    </Badge>
                    <Text fontSize="sm" color="#334155" whiteSpace="pre-wrap">
                      {report.description}
                    </Text>
                  </Box>

                  <Box mt={4}>
                    <Text fontSize="sm" fontWeight="600" color={colors.darkest} mb={2}>
                      Admin Note
                    </Text>
                    <Textarea
                      minH="84px"
                      placeholder="Add handling notes for your team"
                      value={noteByReportId[report.report_id] ?? report.admin_note ?? ""}
                      onChange={(event) =>
                        setNoteByReportId((prev) => ({
                          ...prev,
                          [report.report_id]: event.target.value,
                        }))
                      }
                    />
                  </Box>

                  <Flex mt={4} justify="space-between" align={{ base: "stretch", md: "center" }} direction={{ base: "column", md: "row" }} gap={3}>
                    <Text fontSize="xs" color="gray.500">
                      {handledLabel
                        ? `Last update: ${handledLabel} by ${report.handledBy?.name || "Admin"}`
                        : "Not handled yet"}
                    </Text>

                    <HStack gap={2} flexWrap="wrap" justify={{ base: "flex-start", md: "flex-end" }}>
                      <Button
                        size="sm"
                        bg="#dbeafe"
                        color="#1e3a8a"
                        _hover={{ bg: "#bfdbfe" }}
                        onClick={() => handleUpdateStatus(report, "in_review")}
                        loading={savingReportId === report.report_id}
                      >
                        In Review
                      </Button>
                      <Button
                        size="sm"
                        bg="#dcfce7"
                        color="#166534"
                        _hover={{ bg: "#bbf7d0" }}
                        onClick={() => handleUpdateStatus(report, "resolved")}
                        loading={savingReportId === report.report_id}
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        bg="#fee2e2"
                        color="#991b1b"
                        _hover={{ bg: "#fecaca" }}
                        onClick={() => handleUpdateStatus(report, "rejected")}
                        loading={savingReportId === report.report_id}
                      >
                        Reject
                      </Button>
                      <IconButton
                        aria-label="Delete report"
                        size="sm"
                        bg="red.50"
                        color="red.600"
                        borderRadius="10px"
                        _hover={{ bg: "red.100" }}
                        onClick={() => handleDeleteReport(report.report_id)}
                        isLoading={savingReportId === report.report_id}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </HStack>
                  </Flex>
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>
    </Box>
  );
}